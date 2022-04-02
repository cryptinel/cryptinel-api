import fs from 'fs'

export const saveFileTo = (file_root_path, file_name, file_extension, content) => {
	// convert JSON object to string
	const file_fullpath = `${file_root_path}/${file_name}.${file_extension}`;
	
	// write JSON string to a file
	fs.writeFile(file_fullpath, content, (err) => {
	  if (err) {
		throw err;
	  }
	  
	  console.log(`File ${file_name}.${file_extension} is saved on ${file_fullpath}.`);
	});
}
