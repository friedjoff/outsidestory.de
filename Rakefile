task :build do
  rm_r 'tmp'
  mkdir_p 'tmp/source'
  cp 'website/index.html.erb', 'tmp/source/'
  cp 'website/crew.html.erb', 'tmp/source/'
  cp_r 'website/layouts', 'tmp/source/layouts'
  touren = FileList.new('touren/**/meta.yaml')
  for tour in touren
    dir = File.dirname(tour)
    path = 'tmp/source/' + dir.slice(7, 4) + '-' + dir.slice(12, dir.length)
    mkdir_p path
    indexFile = File.open(path + '/index.html.md', 'w')
    indexFile.puts '---'
    indexFile.puts File.readlines(dir + '/meta.yaml')
    if File.exists?(dir + '/fotos.yaml') then
      indexFile.puts 'fotos:'
      index = 1
      for foto in File.readlines(dir + '/fotos.yaml')
        indexFile.puts " #{index}: [#{foto}]"
        index = index+1
      end
    end
    indexFile.puts '---'
    if File.exists?(dir + '/bericht.md') then
      indexFile.puts File.readlines(dir + '/bericht.md')
    end
    indexFile.close
  end
  cd 'tmp'
  touch 'config.rb'
  sh %{middleman build}
  cp_r 'build/.', '../build/'
  cd '..'
  #rm_r 'tmp'
  cp_r 'website/resources/.', 'build/'
end

task :sync do
  sh %{rsync -avz --delete --exclude '.DS_Store' build/ outsidestory.de:html/}
end

task :teaser do
  require 'yaml'
  require 'mini_magick'
  cssFile = File.open('website/stylesheets/touren.css', 'w')
  touren = FileList.new('touren/**/meta.yaml')
  for tour in touren
    meta = YAML.load(File.read(tour))
    if meta['teaser'] then
      dir = File.dirname(tour)
      name = dir.slice(7, 4) + '-' + dir.slice(12, dir.length)
      path = 'build/' + name
      teaser = MiniMagick::Image.open(dir + '/' + meta['teaser'])
      resize_to_fill(teaser, 960, 480)
      teaser.quality '80'
      teaser.write path + '/teaser.jpg'
      cssFile.puts ".tour-#{name} {background-image: url('/#{name}/teaser.jpg');}\n"
    end
  end
  cssFile.close
  Rake::Task['css'].invoke
end

task :js do
  require 'yui/compressor'
  # TODO: add exclude variable for debugging
  
  jsFile = File.open('build/script.js', 'w')
  jsCompressor = YUI::JavaScriptCompressor.new()
  for js in ['jquery', 'video', 'galleria', 'galleria.classic', 'piwik']
    jsFile.puts jsCompressor.compress(File.open("website/javascripts/#{js}.js"))
  end
  jsFile.close
end

task :css do
  require 'yui/compressor'
  cssFile = File.open('build/style.css', 'w')
  cssCompressor = YUI::CssCompressor.new()
  for css in FileList.new('website/stylesheets/*.css')
    cssFile.puts cssCompressor.compress(File.open(css))
  end
  cssFile.close
end

task :fotos do
  require 'mini_magick'
  require 'archive/zip'
  # TODO: image compression (ie. https://github.com/grosser/smusher)
  ordner = ENV['folder'] || 'touren'
  fotos = FileList.new(ordner.gsub(/^\/|\/$/, '') + '/**/*.jpg')
  for foto in fotos
    dir = File.dirname(foto)
    path = 'build/' + dir.slice(7, 4) + '-' + dir.slice(12, dir.length)
    
    puts 'processing ' + foto
    mkdir_p path + '/max'
    max = MiniMagick::Image.open(foto)
    max.resize '960x720'
    max.quality '80'
    max.write path + '/max/' + File.basename(foto)
    
    mkdir_p path + '/min'
    min = MiniMagick::Image.open(foto)
    min.resize '53x40'
    min.quality '80'
    min.write path + '/min/' + File.basename(foto)
  end
end

task :fotos2meta do
  require 'mini_exiftool'
  ordner = ENV['folder'] || 'touren'
  fotos = FileList.new(ordner.gsub(/^\/|\/$/, '') + '/**/*.jpg')
  oldDir, metaFile = nil
  for foto in fotos
    puts 'reading ' + foto
    dir = File.dirname(foto)
    if dir != oldDir then
      if metaFile then
        metaFile.close
      end
      metaFile = File.open(dir + '/../fotos.yaml', 'w')
    end
    oldDir = dir
    exif = MiniExiftool.new foto
    metaFile.puts "'#{exif.title}', '#{exif.description}'"
  end
  metaFile.close
end

task :encode_film do
  ordner = ENV['folder'] || 'touren'
  filme = FileList.new(ordner.gsub(/^\/|\/$/, '') + '/**/film.*')
  for film in filme
    puts "encoding #{film}"
    dir = File.dirname(film)
    path = 'build/' + dir.slice(7, 4) + '-' + dir.slice(12, dir.length)
    sh %{ffmpeg -y -i #{film} -s 640x480 -threads 2 -acodec libvorbis -f webm -vcodec libvpx -qmax 32 -qmin 8 -aq 60 -ac 2 #{path}/film.webm}
    sh %{ffmpeg -y -i #{film} -s 640x480 -threads 2 -acodec libfaac -ab 96k -vcodec libx264 -vpre slow -crf 22 #{path}/film.mp4}
  end
end

def resize_to_fill(image, width, height)
  cols, rows = image[:dimensions]
  if width != cols || height != rows
    scale = [width/cols.to_f, height/rows.to_f].max
    cols = (scale * (cols + 0.5)).round
    rows = (scale * (rows + 0.5)).round
    image.resize "#{cols}x#{rows}"
    image.gravity 'center'
    image.extent "#{width}x#{height}" if cols != width || rows != height
  end
end