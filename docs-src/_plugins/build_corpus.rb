## Simple plugin for generating an index file for search engine
## Author: Tieson T. (https://github.com/tiesont)

require 'pathname' 
require 'json' 
require 'nokogiri'
require 'loofah'

@json = Array.new

def build_index
    root = Pathname.new(__FILE__).join('..')
    data_dir = root + '../assets/data'

    if !Dir.exist?(data_dir) then
        Dir.mkdir(data_dir)
    end
    
    # TODO figure out correct syntax for building path to index.json file
    index_path = File.join(data_dir, 'index.json')

    i = 1
    index_json = File.new(index_path, 'w')

    # Load and parse all includes for the documentation page and the F.A.Q. page
    dirs = ['documentation', 'faq']
    dirs.each do |path|
        docs = Array.new

        docs_path = File.join(root, "/../_includes/", path)

        if Dir.exist?(docs_path) then
            Dir.children(docs_path).each do |file_name|
                docs.push(File.join(docs_path, file_name))      
            end # entries
        end

        docs.each do |file_name|
            i = parse_file(i, file_name, "%s.html" % [path])
        end # files to read
    end

    # If we found any sections, write the index
    if @json.length > 0
        # pipe generated JSON into file
        index_json.puts(::JSON.generate(@json, quirks_mode: true))
    end
    
    # write contents of index to file?
    index_json.close()

    puts "Wrote %s index entries" % [i]
end

# Load file, parsing out topics for search index
def parse_file(index, file_name, page_path)
    file = File.read(file_name)
    html = Nokogiri::HTML.fragment(file)

    html.css('.topic').each do |section|
        anchor = section.css('.topic-anchor')[0]

        if anchor != nil then
            if anchor.text != nil then
                href = anchor['id']
                url = "%s#%s" % [page_path, href]

                title = anchor.text.strip() # remove trailing and leading spaces, plus newline characters

                content = section.css('.topic-content')[0]

                if content != nil then
                    if content.text != nil then
                        body = Loofah.fragment(content.text).scrub!(:strip).text.delete!("\t\r\n").strip

                        # Need to build a JSON object, like so:
                        # { "id":"", "title":"", "body":"", "url":"" }
                        doc = {
                            "id" => index,
                            "title" => title,
                            "url" => url,
                            "body" => body
                        }

                        @json.push(doc)

                        index = index + 1
                    end
                end
            end
        end
    end # sections to read 
    
    return index
end

build_index()