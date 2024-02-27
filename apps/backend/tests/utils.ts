const mailApi = "http://localhost:8025";

const mailClient = (endpoint: string, request: FetchRequestInit) =>
  fetch(mailApi + endpoint, request);

export const deleteAllMails = async () => {
  await mailClient("/api/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
};

export const getPasscodeFromMail = async () => {
  return await mailClient("/api/v1/message/latest", {
    method: "GET",
  })
    .then((r: Response) => r.json())
    .then((d) => {
      const data = d as { Subject: string };
      if (data) {
        const code = data.Subject.match(/[0-9]+/);
        if (!code) return null;
        return code[0];
      }
      return null;
    });
};
