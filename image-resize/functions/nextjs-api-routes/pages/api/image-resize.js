const jimp = require('jimp');

export default (req, res) => {
  const {
    method,
  } = req

  const { imageUrl, width, height } = req.body.input;

  switch (method) {
    case 'POST':
      // Update or create data in your database

      jimp.read(imageUrl, async function(err,img) {
        if(err) {
          res.status(400).json({ error: err });
        }

        const fileName = imageUrl.substring(imageUrl.lastIndexOf('/')+1);
        const imageName = `${fileName}-${width}x${height}`;
        const imageExtension = `.png`;

        await img.resize(width, height);
        await img.writeAsync(`public/images/${imageName}${imageExtension}`);
        res.status(200).json({ 
          imageUrl: `http://localhost:3000/images/${imageName}${imageExtension}`,
        })

      });

      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
