## Prerequisites for building:

- nodejs (https://nodejs.org)
- Ruby (https://ruby-lang.org)
- Jekyll (https://jekyllrb.com)

I recommend installing the components listed above in the order shown.

## Install gems

Once the requirements have been met, open a terminal in the project folder and enter the following command:

```
bundle install
```

This will install all of the components configued in the Gemfile. To update to the newest version of any of the configured gems, run:

```
bundle update
```

## Build & Run

After the installer completes, type the following command to build the site and start a local web server for viewing the generated site:

```
bundle exec jekyll serve --watch
```

That's it. Navigate to the URL shown in the terminal output, and you should see the current documentation site.