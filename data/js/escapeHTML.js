function escapeHTML(str) str.replace(/[&"<>]/g, function (m) escapeHTML.replacements[m]);
escapeHTML.replacements = { "&": "&amp;", '"': "&quot", "<": "&lt;", ">": "&gt;" };
