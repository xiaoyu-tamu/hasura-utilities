import fetch from "node-fetch";

export function request(data: Record<string, any>): Promise<any> {
  const API = `${process.env.API}/v1/query`;

  return fetch(API, {
    headers: {
      "Content-Type": "application/json",
      "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET as string
    },
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => res.json());
}
