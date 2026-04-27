import cartModel from "../models/cart.model.js";

export const addToCart = async (req, res) => {

    try {
        const userId = req.user._id;
        const { foodId } = req.body;

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = await cartModel.create({
                user: userId,
                items: [{ food: foodId, quantity: 1 }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.food.toString() === foodId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += 1;
            } else {
                cart.items.push({ food: foodId, quantity: 1 });
            }
            await cart.save();
        }
        res.status(200).json({
            message: "Item added to cart",
            cart
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error adding to cart"
        });
    }
}

export const getCart = async (req, res) => {
    try {
        const cart = await cartModel
            .findOne({ user: req.user._id })
            .populate("items.food");

        res.status(200).json({
            message: "Cart detail",
            cart
        });

    } catch {
        res.status(500).json({
            message: "Error fetching cart"
        });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { foodId } = req.params;
        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.food.toString() !== foodId
        )

        await cart.save();

        res.status(200).json({
            message: "Item removed",
            cart
        });
    } catch {
        res.status(500).json({
            message: "Error removing item"
        });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;
        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.food.toString() === foodId
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter(
                i => i.food.toString() !== foodId
            );
        } else {
            item.quantity = quantity;
        }

        res.status(200).json({
            message: "Cart updated",
            cart
        });

    } catch {
        res.status(500).json({
            message: "Error updating cart"
        });
    }
}