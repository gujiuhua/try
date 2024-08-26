const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// 文件路径
const DATA_FILE = 'posts.json';
const UPLOADS_DIR = 'uploads';

// 设置 multer 存储配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage });

// 读取数据文件
const readPostsFromFile = () => {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    return [];
};

// 写入数据文件
const writePostsToFile = (posts) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
};

// 用来存储博客文章
let posts = readPostsFromFile();

// 处理静态文件
app.use(express.static('public'));
app.use('/uploads', express.static(UPLOADS_DIR));

// 解析 JSON 请求体
app.use(express.json());

// 获取所有文章
app.get('/posts', (req, res) => {
    res.json(posts);
});

// 创建新文章
app.post('/posts', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (title && content) {
        const newPost = { id: Date.now(), title, content, image };
        posts.push(newPost);
        writePostsToFile(posts);
        res.status(201).json({ message: 'Post created', post: newPost });
    } else {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// 删除文章
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    posts = posts.filter(post => post.id !== postId);
    writePostsToFile(posts);
    res.status(200).json({ message: 'Post deleted' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
