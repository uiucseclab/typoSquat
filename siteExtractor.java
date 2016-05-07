import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.Exception;
import java.util.zip.DataFormatException;

public class siteExtractor{
	
	public static void main(String[] args){
		BufferedReader infile;
		FileWriter outfile;
		try{
			infile = new BufferedReader(new FileReader(new File(args[0])));
			outfile = new FileWriter(new File(args[1]));
			infile.readLine();//kills the column labels on the first line
			processLines(infile, outfile);
		}catch(IOException e){
			System.out.println("Fatal Error: Unable to open file.");
			return;
		}
		
	}
	
	static void processLines(BufferedReader in, FileWriter out){
		try{
			String line = null;
			while((line=in.readLine())!=null){
				line = line.toLowerCase();//some lines use improper case in the file, fix this
				if(line.startsWith("***"))break;//reached end of data
				line = cutToWebAddr(line);
				if(line.startsWith("http://")) line = line.substring(7);//remove protocols
				else if(line.startsWith("https://")) line = line.substring(8);
				int x = line.indexOf("/");
				if(x != -1) line = line.substring(0,x);
				int tldStart = line.lastIndexOf(".");
				if(tldStart >= 1){
					x = line.lastIndexOf(".",tldStart-1);
					x = x==-1?0:x;
					System.out.println(x + ", " + tldStart);
					line = line.substring(x+1,tldStart);
				}
				if(line.equals("null") || line.equals("none") || line.equals("na")) continue;
				if(!line.equals("")){
					out.write(line+"\n");
					System.out.println(line);
				}
			}
		}catch(IOException e){
			System.out.println("unknown IOException");
			return;
		}catch(DataFormatException df){
			System.out.println("DataFormatException");
			return;
		}
		
	}
	
	static String cutToWebAddr(String line) throws DataFormatException{
		int end = line.length();
		int count = 0;
		//System.out.println(line+"\n length:"+line.length());
		while(count < 4 && end > 0){//walk back from end of the line to the webaddress slot
			end = line.lastIndexOf(",",end-1);
			count++;
		}
		if(end == -1){
			System.out.println("invalid line parsed");
			throw new DataFormatException("invalid line parsed");
		}
		int front = line.lastIndexOf(",",end-1);
		if(front == -1){
			System.out.println("invalid line parsed");
			throw new DataFormatException("invalid line parsed");
		}
		//System.out.println(front+" "+end);
		return line.substring(front+2, end-1);//cuts off the "" and the commas
	}
}