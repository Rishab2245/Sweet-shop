const Sweet = require('../models/Sweet');
const { Op } = require('sequelize');

class SweetService {
  async getAllSweets() {
    return await Sweet.findAll();
  }

  async getSweetById(id) {
    const sweet = await Sweet.findByPk(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }
    return sweet;
  }

  async createSweet(sweetData) {
    const { name, category, price, quantity } = sweetData;
    
    // Check if sweet with same name already exists
    const existingSweet = await Sweet.findOne({ where: { name } });
    if (existingSweet) {
      throw new Error('Sweet with this name already exists');
    }

    return await Sweet.create({
      name,
      category,
      price,
      quantity,
    });
  }

  async updateSweet(id, sweetData) {
    const sweet = await this.getSweetById(id);
    
    // Check if name is being changed and if it conflicts with existing sweet
    if (sweetData.name && sweetData.name !== sweet.name) {
      const existingSweet = await Sweet.findOne({ where: { name: sweetData.name } });
      if (existingSweet) {
        throw new Error('Sweet with this name already exists');
      }
    }

    await sweet.update(sweetData);
    return sweet;
  }

  async deleteSweet(id) {
    const sweet = await this.getSweetById(id);
    await sweet.destroy();
    return { message: 'Sweet deleted successfully' };
  }

  async searchSweets(searchParams) {
    const { name, category, minPrice, maxPrice } = searchParams;
    const whereClause = {};

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (category) {
      whereClause.category = { [Op.like]: `%${category}%` };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) {
        whereClause.price[Op.gte] = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.price[Op.lte] = maxPrice;
      }
    }

    return await Sweet.findAll({ where: whereClause });
  }

  async purchaseSweet(id, quantity = 1) {
    const sweet = await this.getSweetById(id);
    
    if (sweet.quantity < quantity) {
      throw new Error('Insufficient quantity in stock');
    }

    sweet.quantity -= quantity;
    await sweet.save();

    return {
      message: `Successfully purchased ${quantity} ${sweet.name}(s)`,
      sweet,
    };
  }

  async restockSweet(id, quantity) {
    const sweet = await this.getSweetById(id);
    
    sweet.quantity += quantity;
    await sweet.save();

    return {
      message: `Successfully restocked ${quantity} ${sweet.name}(s)`,
      sweet,
    };
  }
}

module.exports = new SweetService();

