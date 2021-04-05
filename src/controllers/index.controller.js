const indexControlador = {};

indexControlador.renderIndex = (req, res) => {
    res.render('index');
};

indexControlador.renderAbout = (req, res) => {
    res.render('about');
}

indexControlador.renderServicio = (req, res) => {
    res.render('servicios');
}
module.exports = indexControlador;