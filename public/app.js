document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', imageFile);

    await fetch('/posts', {
        method: 'POST',
        body: formData,
    });

    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('image').value = '';

    loadPosts();
});

async function loadPosts() {
    const response = await fetch('/posts');
    const posts = await response.json();

    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = posts.map(post => `
        <div>
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="${post.title}" width="200"/>` : ''}
            <button onclick="deletePost(${post.id})">Delete</button>
        </div>
    `).join('');
}

async function deletePost(postId) {
    await fetch(`/posts/${postId}`, {
        method: 'DELETE',
    });
    loadPosts();
}

loadPosts();
