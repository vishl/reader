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

class GlobalSettingsController < ApplicationController
  before_filter :ensure_admin

  def edit
    @settings = GlobalSettings.defaults.merge(GlobalSettings.all)
  end

  def update
    @settings = GlobalSettings.defaults.merge(GlobalSettings.all)
    @settings.each do |k,v|
      GlobalSettings[k] = conv(v.class, params[:global_settings][k])
    end
    @settings = GlobalSettings.defaults.merge(GlobalSettings.all)
    render 'edit'
  end

  private
    def conv(type, val)
      if val == ".nil"
        nil
      elsif val == ".false"
        false
      elsif val == ".true"
        true
      elsif (type == TrueClass) || (type == FalseClass)
        val=="1"? true : false
      elsif type == Fixnum
        val.to_i
      elsif type == Float
        val.to_f
      else
        val
      end
    end


end


