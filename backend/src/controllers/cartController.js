import cartModel from "../models/cartModel.js";

/* ===============================
   GET ALL CARTS (ADMIN)
================================ */
export const getCarts = async (req, res) => {
  try {
    const carts = await cartModel.find().populate("items.productId");
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET CART BY USER ID
================================ */
export const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");

    if (!cart) {
      return res.status(200).json({ userId, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADD TO CART
================================ */
export const addToCartById = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Thiếu userId hoặc productId" });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: [{ productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   UPDATE QUANTITY (+ / -)
================================ */
export const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity < 1) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   REMOVE ONE ITEM
================================ */
export const removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Thiếu userId hoặc productId" });
    }

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   CLEAR CART
================================ */
export const clearCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await cartModel.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
