#Copyright 2012 Vishal Parikh
#This file is part of Freader.
#Freader is free software: you can redistribute it and/or modify
#it under the terms of the GNU General Public License as published by
#the Free Software Foundation, either version 3 of the License, or
#(at your option) any later version.
#
#Freader is distributed in the hope that it will be useful,
#but WITHOUT ANY WARRANTY; without even the implied warranty of
#MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#GNU General Public License for more details.
#
#You should have received a copy of the GNU General Public License
#along with Freader.  If not, see <http://www.gnu.org/licenses/>.

class ApplicationController < ActionController::Base
  include SessionsHelper
  before_filter :check_uri
  protect_from_forgery

  def check_uri
    if(Rails.env.production? && request.host != GlobalSettings.app_domain)
      redirect_to request.protocol + GlobalSettings.app_domain + request.request_uri 
    end
  end
end
