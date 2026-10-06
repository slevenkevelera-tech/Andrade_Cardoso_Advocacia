export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  labelIds: string[];
  unread: boolean;
  bodyText?: string;
}

export interface GmailUserProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch {
    return atob(base64);
  }
}

export const getGmailProfile = async (accessToken: string): Promise<GmailUserProfile> => {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Erro ao obter perfil do Gmail: ${res.statusText}`);
  }
  return res.json();
};

export const listGmailMessages = async (
  accessToken: string,
  query: string = '',
  maxResults: number = 15
): Promise<{ messages: { id: string; threadId: string }[]; nextPageToken?: string }> => {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', maxResults.toString());
  if (query.trim()) {
    url.searchParams.set('q', query.trim());
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Erro ao listar mensagens do Gmail: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    messages: data.messages || [],
    nextPageToken: data.nextPageToken,
  };
};

export const getGmailMessage = async (
  accessToken: string,
  messageId: string
): Promise<GmailMessageSummary> => {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Erro ao buscar mensagem ${messageId}: ${res.statusText}`);
  }

  const data = await res.json();
  const headers: GmailHeader[] = data.payload?.headers || [];

  const getHeader = (name: string): string => {
    const found = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
    return found ? found.value : '';
  };

  let bodyText = '';
  if (data.payload?.body?.data) {
    bodyText = base64UrlDecode(data.payload.body.data);
  } else if (data.payload?.parts) {
    // Find text/plain part or text/html
    const textPart = data.payload.parts.find((p: any) => p.mimeType === 'text/plain') ||
                     data.payload.parts.find((p: any) => p.mimeType === 'text/html') ||
                     data.payload.parts[0];
    if (textPart?.body?.data) {
      bodyText = base64UrlDecode(textPart.body.data);
    }
  }

  const labelIds: string[] = data.labelIds || [];
  const isUnread = labelIds.includes('UNREAD');

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet || '',
    subject: getHeader('Subject') || '(Sem assunto)',
    from: getHeader('From') || '(Remetente desconhecido)',
    to: getHeader('To') || '',
    date: getHeader('Date') || '',
    labelIds,
    unread: isUnread,
    bodyText: bodyText || data.snippet,
  };
};

export const sendGmailEmail = async (
  accessToken: string,
  to: string,
  subject: string,
  message: string,
  fromEmail?: string
): Promise<any> => {
  const emailLines = [
    `To: ${to}`,
    ...(fromEmail ? [`From: ${fromEmail}`] : []),
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    message,
  ];

  const raw = base64UrlEncode(emailLines.join('\r\n'));

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Falha ao enviar e-mail: ${res.statusText}`
    );
  }

  return res.json();
};

export const trashGmailMessage = async (
  accessToken: string,
  messageId: string
): Promise<any> => {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Falha ao mover mensagem para a lixeira: ${res.statusText}`);
  }

  return res.json();
};
