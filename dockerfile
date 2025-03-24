ARG jekyll_version=latest
FROM jekyll/jekyll:${jekyll_version}

LABEL maintainer="Marcel Melzig <marcel@3h-co.de>"
LABEL org.label-schema.schema-version="1.0.0-rc.1"
LABEL org.label-schema.name="My blog"
LABEL org.label-schema.description="This image runs my blog for local development."
LABEL org.label-schema.version="${jekyll_version}"

COPY website /srv/jekyll
COPY data/jekyll/config/_config.yml /srv/jekyll/_config.yml

ENTRYPOINT [ "jekyll", "serve", "--livereload"]