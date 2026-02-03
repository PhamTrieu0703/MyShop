import productsModel from "../models/productsModel.js";
import orderModel from "../models/orderModel.js";
export const getTopProducts = async (req, res) => {
  try {
    const result = await orderModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 8 }
    ]);

    const productId = result.map(i => i._id);

    const products = await productsModel.find({
      _id: { $in: productId }
    });

    const final = products.map(p => {
      const sold = result.find(r => r._id.toString() === p._id.toString());
      return {
        ...p.toObject(),
        totalSold: sold?.totalSold || 0
      };
    });

    res.json(final);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};



export const getProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productsModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "nooo" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, description, image,imageAfter, category,sizes, stock ,discount,isActive} = req.body;
    try {
    const newProduct = new productsModel({ name, price, description, image,imageAfter, category,sizes, stock, discount, isActive  });
    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image,imageAfter, category,sizes, stock ,discount } = req.body;
    try {
    const updatedProduct = await productsModel.findByIdAndUpdate(
      id,
      { name, price, description, image,imageAfter, category,sizes, stock ,discount},
        { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.params;
    try {
    await productsModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

