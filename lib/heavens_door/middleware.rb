# frozen_string_literal: true

module HeavensDoor
  class Middleware
    def initialize(app)
      @app = app
    end

    def call(env)
      status, headers, body = @app.call env

      if headers && headers['Content-Type']&.include?('text/html') && (env['REQUEST_PATH'] !~ %r[^/*heavens_door/])
        case body
        when ActionDispatch::Response, ActionDispatch::Response::RackBody
          body = body.body
        when Array
          body = body[0]
        end

        body.sub!(/<body[^>]*>/) { %Q[#{$~}\n<div id="heavens-door"><span id="heavens-door-start">⏺</span><span id="heavens-door-stop">⏹</span><span id="heavens-door-copy">📋</span></div>] }

        [status, headers, [body]]
      else
        [status, headers, body]
      end
    end
  end
end
