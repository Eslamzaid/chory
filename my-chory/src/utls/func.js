const checkIsAuth = async () => {
  const res = await fetch("http://localhost:4000/api", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log(data);
  return data;
};

export { checkIsAuth };
