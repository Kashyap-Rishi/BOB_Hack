const { v4: uuidv4 } = require('uuid');

const addData = async (req, res) => {
  const container = req.app.locals.container;
  const { id = uuidv4(), ...data } = req.body;

  try {
    const { resource } = await container.items.create({ id, ...data });
    res.status(201).json(resource);
  } catch (err) {
    console.error('Error adding data:', err);
    res.status(500).json({ error: 'An error occurred while adding data.' });
  }
};

module.exports = {
  addData,
};
