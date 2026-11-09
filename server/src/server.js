/**
 * SehatLink - HTTP Server Entrypoint (Sprint 1: US-01 Patient Registration)
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Role: Backend System Architect
 * Standards: OWASP Top 10, Modular Architecture (MNT-01)
 */

import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server instance
const server = http.createServer(app);

// Server startup function
async function startServer() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` SehatLink Backend API Server running on port ${PORT}`);
    console.log(` Architect: Ahmed Tahir (L1F23BSSE0123)`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Socket.IO Real-Time Queue Broadcasts: ACTIVE`);
    console.log(`=======================================================`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { server, app };
