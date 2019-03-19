
module.exports = {
    
    init: (req, res) => {
      res.render('layout', {
        title: 'Messenger Test',
        content: 'messenger/form'
      });
    }
}