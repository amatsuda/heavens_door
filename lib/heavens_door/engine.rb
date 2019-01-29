# frozen_string_literal: true

require_relative 'middleware'

module HeavensDoor
  class Engine < ::Rails::Engine #:nodoc:
    initializer 'HeavensDoor' do |app|
      app.middleware.use HeavensDoor::Middleware

      app.config.assets.precompile += %w(heavens_door.css)
    end
  end
end
