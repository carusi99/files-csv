import multer from 'multer';

const storage = multer.diskStorage({ // Configura el almacenamiento de archivos en disco para Multer
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nombre del archivo guardado en el directorio destino de Multer
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') { 
      return cb(new Error('Only CSV files allowed'));
    }
    cb(null, true);
  }
});

export default upload;
