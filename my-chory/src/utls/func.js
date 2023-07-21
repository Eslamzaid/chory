const checkIsAuth = async () => {
  try {
    const res = await fetch("http://localhost:4000/", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch authentication status.");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error during authentication check:", error);
    // Handle the error, for example, by returning an error object.
    return { success: false, message: "Error during authentication check." };
  }
};

export { checkIsAuth };
