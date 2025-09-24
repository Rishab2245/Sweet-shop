const sweetService = require('../services/sweetService');

class SweetController {
  async getAllSweets(req, res) {
    try {
      const sweets = await sweetService.getAllSweets();
      res.json(sweets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSweetById(req, res) {
    try {
      const { id } = req.params;
      const sweet = await sweetService.getSweetById(id);
      res.json(sweet);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createSweet(req, res) {
    try {
      const { name, category, price, quantity } = req.body;

      if (!name || !category || price === undefined || quantity === undefined) {
        return res.status(400).json({ 
          error: 'Name, category, price, and quantity are required' 
        });
      }

      if (price < 0 || quantity < 0) {
        return res.status(400).json({ 
          error: 'Price and quantity must be non-negative' 
        });
      }

      const sweet = await sweetService.createSweet({ name, category, price, quantity });
      res.status(201).json(sweet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateSweet(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.price !== undefined && updateData.price < 0) {
        return res.status(400).json({ error: 'Price must be non-negative' });
      }

      if (updateData.quantity !== undefined && updateData.quantity < 0) {
        return res.status(400).json({ error: 'Quantity must be non-negative' });
      }

      const sweet = await sweetService.updateSweet(id, updateData);
      res.json(sweet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSweet(req, res) {
    try {
      const { id } = req.params;
      const result = await sweetService.deleteSweet(id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async searchSweets(req, res) {
    try {
      const { name, category, minPrice, maxPrice } = req.query;
      const searchParams = {
        name,
        category,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      };

      const sweets = await sweetService.searchSweets(searchParams);
      res.json(sweets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async purchaseSweet(req, res) {
    try {
      const { id } = req.params;
      const { quantity = 1 } = req.body;

      if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be positive' });
      }

      const result = await sweetService.purchaseSweet(id, quantity);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async restockSweet(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Positive quantity is required' });
      }

      const result = await sweetService.restockSweet(id, quantity);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new SweetController();

