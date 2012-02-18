class PagesController < ApplicationController
  def home
    @forum = Forum.new
  end

  def bookmarklet
    @sid = params[:sid]
    render 'bookmarklet', :layout=>false, :content_type=>"text/javascript"
  end

  def backbone
  end

  def bbcv
    @content = params[:content]
    render :layout=>false
  end

  def postframe
    render :layout=>false
  end
end
