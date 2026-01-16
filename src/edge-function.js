// ESA Edge Function for Notes Service
const KV_NAMESPACE = 'notes_storage';

// Initialize Edge KV
const edgeKv = new EdgeKV({ namespace: KV_NAMESPACE });

// Generate random ID
function generateId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // API: Create note
  if (path === '/api/notes' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { title, content, expiryTime, burnAfterReading } = body;

      if (!content) {
        return new Response(JSON.stringify({ error: '内容不能为空' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Generate unique ID
      let id;
      let attempts = 0;
      do {
        id = generateId();
        const existing = await edgeKv.get(`note:${id}`);
        if (!existing) break;
        attempts++;
      } while (attempts < 10);

      if (attempts >= 10) {
        return new Response(JSON.stringify({ error: '生成ID失败，请重试' }), {
          status: 500,
          headers: corsHeaders
        });
      }

      // Store note data
      const noteData = {
        id,
        title: title || '',
        content,
        createdAt: new Date().toISOString(),
        expiresAt: expiryTime > 0 ? new Date(Date.now() + expiryTime * 1000).toISOString() : null,
        burnAfterReading: burnAfterReading || false,
        views: 0
      };

      await edgeKv.put(`note:${id}`, JSON.stringify(noteData));

      return new Response(JSON.stringify({
        success: true,
        id
      }), {
        headers: corsHeaders
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: '服务器错误' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  // API: Get note
  if (path.startsWith('/api/notes/') && request.method === 'GET') {
    try {
      const id = path.split('/').pop();
      const noteData = await edgeKv.get(`note:${id}`);

      if (!noteData) {
        return new Response(JSON.stringify({ error: '便签不存在' }), {
          status: 404,
          headers: corsHeaders
        });
      }

      const note = JSON.parse(noteData);

      // Check if expired
      if (note.expiresAt && new Date(note.expiresAt) < new Date()) {
        await edgeKv.delete(`note:${id}`);
        return new Response(JSON.stringify({ error: '便签已过期' }), {
          status: 410,
          headers: corsHeaders
        });
      }

      // Increment view count
      note.views = (note.views || 0) + 1;

      // If burn after reading, delete after first view
      if (note.burnAfterReading && note.views > 0) {
        await edgeKv.delete(`note:${id}`);
      } else {
        await edgeKv.put(`note:${id}`, JSON.stringify(note));
      }

      return new Response(JSON.stringify(note), {
        headers: corsHeaders
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: '查询失败' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  // For unmatched routes, let ESA's SPA fallback handle it
  return new Response(null, { status: 404 });
}

export default {
  async fetch(request) {
    return handleRequest(request);
  }
};
