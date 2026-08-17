import dns from "node:dns";

// Some local/VPN network setups configure Node's default DNS resolver to a
// stub server (e.g. 127.0.0.1) that refuses SRV-type queries, breaking
// mongodb+srv:// connection strings even though the record itself is fine.
// Point Node's resolver at public DNS servers in development only.
if (process.env.NODE_ENV === "development") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}
