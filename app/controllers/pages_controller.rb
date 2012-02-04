class PagesController < ApplicationController
  def home
    @forum = Forum.new
  end

end
