export const handler = async (_event: any) => {
  console.log(_event);

  return {
    statusCode: 200,
    body: JSON.stringify("hello"),
  };
};
