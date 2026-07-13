const prisma = require('../utils/prisma')

const getAllCategories = async(req, res) => {
    try{
        const categories = await prisma.category.findMany({
            orderBy: {name : 'asc'}
        })
        res.json(categories)
    }catch(error) {
    res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllCategories }