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

module GlobalSettingsHelper
  def field_for(f, k, v)
    if v.is_a?(TrueClass) || v.is_a?(FalseClass)
      f.check_box k, :checked=>v
    elsif v.is_a?(Fixnum) || v.is_a?(Float) || v.is_a?(String)
      f.text_field k, :value=>v
    elsif v.is_a?(NilClass)
      f.text_field k, :value=>".nil"
    else
      "WTF, class=#{v.class}"
    end
  end
end


