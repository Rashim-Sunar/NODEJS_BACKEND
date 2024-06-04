module.exports = function(template, details){
    let output = template.replace('{{%title%}}' ,details.title);   
    output = output.replace('{{%body%}}',details.body);
    output = output.replace('{{%ID%}}',details.id);
    output = output.replace('{{%userId%}}', details.userId);
    return output;
}