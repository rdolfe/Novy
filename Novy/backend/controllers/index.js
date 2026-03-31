const express = require('express');
const router = express.Router();

// Example controller functions
const getItems = (req, res) => {
    // Logic to get items from the database
    res.send('Get items');
};

const createItem = (req, res) => {
    // Logic to create a new item in the database
    res.send('Create item');
};

const updateItem = (req, res) => {
    // Logic to update an existing item in the database
    res.send('Update item');
};

const deleteItem = (req, res) => {
    // Logic to delete an item from the database
    res.send('Delete item');
};

// Define routes
router.get('/items', getItems);
router.post('/items', createItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

module.exports = router;