// This is a poor way to handle secure values. Store user data in a DB, and secrets elsewhere.
// Using process.env here is a way to test automatic Docker builds from a parallel repo.

const auth = {
  socketTokenSecret: process.env.SOCKET_TOKEN_SECRET || '' // Add socket secret token here
};

export default auth;
