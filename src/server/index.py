import flask
from flask import Flask


app = Flask(
    import_name=__name__,
    static_url_path="",
    static_folder="../../dist",
    template_folder="../../public"
)


@app.route("/")
@app.route("/<string:arg0>")
def pageRoute(**kwargs) -> str:
    return flask.render_template("index.html")

def main() -> None:
    app.run(host="127.0.0.1", port=80, debug=True)


if __name__ == "__main__": main()