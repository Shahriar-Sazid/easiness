import * as bodyParser from "body-parser";
import * as express from "express";
import * as cookieParser from "cookie-parser"
import * as logger from "morgan"
import * as path from "path"

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    // next(createError(404));
    next()
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.title = "error";
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;