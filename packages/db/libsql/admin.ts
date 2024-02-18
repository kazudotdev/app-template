// refs: https://github.com/Shopify/libsql/blob/main/docs/ADMIN_API.md
export default class AdminClient {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  async createNamespace(name: string) {
    const endpoint = `${this.url}/v1/namespaces/${name}/create`;
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    console.log({ response });
    return response.ok;
  }

  async deleteNamespace(name: string) {
    const endpoint = `${this.url}/v1/namespaces/${name}`;
    const res = await fetch(endpoint, {
      method: "DELETE",
    });
    return res.ok;
  }
}
