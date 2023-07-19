const checkIsAuth = async () => {
  const res = await fetch("http://localhost:4000/api");
  const data = await res.json();
  return data;
};

export { checkIsAuth };
