class ApplicationController < ActionController::Base
  before_filter :check_uri
  protect_from_forgery

  def check_uri
    if(Rails.env.production? && request.host != GlobalSettings.app_domain)
      redirect_to request.protocol + GlobalSettings.app_domain + request.request_uri 
    end
  end
end
