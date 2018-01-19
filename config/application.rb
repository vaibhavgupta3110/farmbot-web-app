require_relative "../app/models/transport.rb"
require File.expand_path('../boot', __FILE__)

require "rails/all"
# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)
module FarmBot
  class Application < Rails::Application
    config.active_job.queue_adapter = :delayed_job
    config.action_dispatch.perform_deep_munge = false
    I18n.enforce_available_locales = false
    config.generators do |g|
      g.template_engine :erb
      g.test_framework :rspec, :fixture_replacement => :factory_bot, :views => false, :helper => false
      g.view_specs false
      g.helper_specs false
      g.fixture_replacement :factory_bot, :dir => 'spec/factories'
    end
    config.autoload_paths << Rails.root.join('lib')
    config.autoload_paths << Rails.root.join('lib/sequence_migrations')
    config.middleware.insert_before ActionDispatch::Static, Rack::Cors do
      allow do
        origins '*'
        resource '/api/*',
                 headers: :any,
                 methods: [:get, :post, :delete, :put, :patch, :options, :head],
                 expose: "X-Farmbot-Rpc-Id",
                 credentials: false, # No cookies.
                 max_age: 0
      end
    end
    Rails.application.routes.default_url_options[:host] = ENV["API_HOST"] || "localhost"
    Rails.application.routes.default_url_options[:port] = ENV["API_PORT"] || 3000
    # ¯\_(ツ)_/¯
    $API_URL = "//#{ Rails.application.routes.default_url_options[:host] }:#{ Rails.application.routes.default_url_options[:port] }"
    ALL_LOCAL_URIS = (
        [ENV["API_HOST"]] + (ENV["EXTRA_DOMAINS"] || "").split(",")
      )
      .map { |x| x.present? ? "#{x}:#{ENV["API_PORT"]}" : nil }.compact
    SecureHeaders::Configuration.default do |config|
      config.hsts                              = "max-age=#{1.week.to_i}"
      config.x_frame_options                   = "DENY"
      config.x_content_type_options            = "nosniff"
      config.x_xss_protection                  = "1; mode=block"
      config.x_download_options                = "noopen"
      config.x_permitted_cross_domain_policies = "none"
      config.referrer_policy                   = %w(
        origin-when-cross-origin
        strict-origin-when-cross-origin
      )
      config.csp                               = {
        default_src: %w(https: 'self'),
        base_uri: %w('self'),
        block_all_mixed_content: false, # :( Some webcam feeds use http://
        child_src: %w('self'),
        connect_src: ALL_LOCAL_URIS + [ENV["MQTT_HOST"],
                      "api.github.com",
                      "raw.githubusercontent.com",
                      "openfarm.cc",
                      "api.rollbar.com"] +
          (Rails.env.production? ? %w(wss:) : %w(ws: localhost:3000 localhost:3808)),
        font_src: %w(
          'self'
          data:
          maxcdn.bootstrapcdn.com
          fonts.googleapis.com
          fonts.gstatic.com
        ),
        form_action: %w('self'),
        frame_ancestors: %w(*), # We need "*" to support webcam users.
        img_src: %w(* data:),   # We need "*" to support webcam users.
        manifest_src: %w('self'),
        media_src: %w(),
        object_src: %w(),
        sandbox: %w(
          allow-scripts
          allow-forms
          allow-same-origin
          allow-modals
        ),
        plugin_types: %w(),
        script_src: %w(
          'self'
          'unsafe-eval'
          'unsafe-inline'
          cdnjs.cloudflare.com
          chrome-extension:
          localhost:3808
        ),
        style_src: %w(
          'unsafe-inline'
          fonts.googleapis.com
          maxcdn.bootstrapcdn.com
          fonts.gstatic.com
        ),
        worker_src: %w(),
        upgrade_insecure_requests: false, # WHY? Some people run webcam feeds
                                          # over plain http://. I wish they
                                          # wouldn't, but I think it's too much
                                          # of an inconvinience to block that
                                          # feature. Comments welcome -RC.
        report_uri: %w(/csp_reports)
      }
    end
  end
end
