import express from 'express';
import cors from 'cors';
import path from 'path';
const app = express();
app.use(cors());

const __dirname = path.resolve();

app.get('/', async (req, res) => {
	try {
		const { text, source, target } = req.query;
		const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
		const response = await fetch(url);
		const json = await response.json();
		const translatedText = json.responseData.translatedText || 'No translation found';
		res.send(translatedText);
	} catch (error) {
		console.log(error);
		res.send('Something went wrong!');
	}
});

// app.use(express.static(path.join(__dirname,"/frontend/dist")));

// app.get("*",(req,res)=>{
// 	res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
// })

app.listen(5000, () => {
	console.log('Server is running on port 5000');
});
