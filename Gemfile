source "https://rubygems.org"
ruby "2.4.2"

gem "rails"
gem "thin"
gem "rails_12factor"
gem "devise"
gem "delayed_job"
gem "delayed_job_active_record"
gem "jwt"
gem "mutations"
gem "active_model_serializers"
gem "rack-cors"
gem "rack-attack"
gem "paperclip"
gem "figaro"
gem "fog-google", git: "https://github.com/fog/fog-google"
gem "pg"
gem "polymorphic_constraints"
gem "tzinfo" # For validation of user selected timezone names
gem "foreman"
gem "webpack-rails"
# Error reporting tools.
# Active on the "official" FarmBot server, set the appropriate ENV
# vars if you wish to use them on your own servers.
gem "rollbar"
gem "skylight", "1.4.0"
gem "bunny"
gem "request_store"
gem "secure_headers"

group :development, :test do
  gem "codecov", require: false
  gem "database_cleaner"
  gem "pry"
  gem "pry-rails"
  gem "factory_bot_rails" # 4.8.0
  gem "faker"
  gem "smarf_doc", git: "https://github.com/RickCarlino/smarf_doc.git"
  gem "rails-erd"
  # TODO: Upgrade versions when they fix this stuff:
  # https://stackoverflow.com/questions/43983466
  #   /controller-test-emits-debug-failure-messages-after-rails-5-1-upgrade
  gem "rspec", "~> 3.5.0"
  gem "rspec-rails", "~> 3.5.0"
  gem "simplecov"
  gem "letter_opener"
end
