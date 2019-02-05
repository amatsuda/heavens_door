# frozen_string_literal: true

module HeavensDoor
  class Middleware
    def initialize(app)
      @app = app
    end

    def call(env)
      status, headers, body = @app.call env

      if headers && headers['Content-Type']&.include?('text/html') &&
          (!env['action_dispatch.content_security_policy']&.script_src('unsafe-inline') && !env['action_dispatch.content_security_policy']&.style_src('unsafe-inline'))  # the Rails default top page has this
        case body
        when ActionDispatch::Response, ActionDispatch::Response::RackBody
          body = body.body
        when Array
          body = body[0]
        end

        body = body.dup if body.frozen?
        body.sub!(/<\/head[^>]*>/) { %Q[<link rel="stylesheet" href="/assets/heavens_door.css" /><script src="/assets/heavens_door.js"></script>\n#{$~}] }
        body.sub!(/<body[^>]*>/) { %Q[#{$~}\n<div id="heavens-door" class="heavens-door-custom"><span id="heavens-door-start">⏺</span><span id="heavens-door-stop">⏹</span><span id="heavens-door-copy">📋</span></div>] }

        [status, headers, [body]]
      else
        [status, headers, body]
      end
    end
  end
end
