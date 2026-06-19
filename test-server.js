import http from 'http';

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    if(res.statusCode !== 200) {
      console.log('Response:', data.slice(0, 1000));
    } else {
      console.log('Server is UP and returned 200');
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
