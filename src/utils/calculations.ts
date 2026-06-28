export interface CartItem {
  price: number;
  protein_g: number;
  calories: number;
  quantity: number;
}

export const calculateTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      acc.total_price += Number(item.price) * item.quantity;
      acc.total_protein += Number(item.protein_g) * item.quantity;
      acc.total_calories += Number(item.calories) * item.quantity;
      return acc;
    },
    { total_price: 0, total_protein: 0, total_calories: 0 }
  );
};
