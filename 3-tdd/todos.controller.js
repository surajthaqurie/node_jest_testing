import axios from "axios";

export const getTodos = async (req, res) => {
  const { data } = await axios(
    "https://jsonplaceholder.typicode.com/todos?_limit=5"
  );

  return res.json({ todos: data });
};

export const getTodo = async (req, res) => {
  try {
    const { data } = await axios(
      `https://jsonplaceholder.typicode.com/todos/${req.params.id}`
    );

    return res.json({ todo: data });
  } catch (err) {
    if (err.response.status === 404) {
      return res.status(404).json({ error: "Todo not found" });
    }
  }
};
