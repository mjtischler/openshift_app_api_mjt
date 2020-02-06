// This should be stored more securely.

const auth = {
  socketTokenSecret: process.env.SOCKET_TOKEN_SECRET || '' // Add socket secret token here
};

export default auth;
