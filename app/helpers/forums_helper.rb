module ForumsHelper
  require 'uri'
  def generate_sid
    SecureRandom.urlsafe_base64
  end

  def bookmarklet(sid)
    "javascript:void((function(){var%20e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','#{GlobalSettings.app_protocol}#{GlobalSettings.app_domain}/bookmarklet?sid=#{sid}&r='+Math.random()*99999999);document.body.appendChild(e)})());"
  end
end
