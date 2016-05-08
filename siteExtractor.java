import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.Exception;
import java.util.zip.DataFormatException;
import java.util.LinkedList;
import java.util.ListIterator;

public class siteExtractor{
	
	public static void main(String[] args){
		BufferedReader infile;
		FileWriter outfile;
		int version;
		try{
			infile = new BufferedReader(new FileReader(new File(args[0])));
			outfile = new FileWriter(new File(args[1]));
			version = Integer.parseInt(args[2]);
			switch(version){
				case 0:
					infile.readLine();//kills the column labels on the first line
					processLines0(infile, outfile);
					break;
				case 1:
					processLines1(infile, outfile);
					break;
				case 2:
					processLines2(infile, outfile);
					break;
				case 3://eliminate duplicates
					processLines3(infile, outfile);
					break;
				default:
					throw new IOException();
			}
		}catch(IOException e){
			System.out.println("Fatal Error: Unable to open file.");
			return;
		}
		
	}
	
	static void processLines3(BufferedReader in, FileWriter out){
		LinkedList<String> list = new LinkedList();
		int countIN = 0;
		int countOUT = 0;
		try{
			String line = null;
			while((line=in.readLine())!=null){
				
				list.add(line);//add processed line
				countIN++;
			}
			while(list.size()>0){
				String s = list.getFirst();
				purgeCopies(s, list);
				out.write(s+"\n");
				countOUT++;
			}
			out.close();
		}catch(IOException e){
			System.out.println("unknown IOException");
			return;
		}

		
		System.out.println(countIN+", "+countOUT);
	}
	
	static void purgeCopies(String str, LinkedList<String> list){
		ListIterator<String> it = list.listIterator(0);
		while(it.hasNext()){
			if(it.next().equals(str))it.remove();//purge matching strings
		}
	}
	
	static void processLines2(BufferedReader in, FileWriter out){
		LinkedList<String> list = new LinkedList();
		int count = 0;
		try{
			String line = null;
			while((line=in.readLine())!=null){
				//process string
				if(line.contains(".com."))line = line.substring(0, line.length()-7);//.com.**
				else if(line.contains(".co."))line = line.substring(0, line.length()-6);//.co.**
				else if(line.contains(".gov."))line = line.substring(0, line.length()-7);//.gov.**
				else if(line.contains(".go."))line = line.substring(0, line.length()-6);//.go.**
				else if(line.contains(".lg."))line = line.substring(0, line.length()-6);//.lg.**
				else if(line.contains(".ac."))line = line.substring(0, line.length()-6);//.ac.**
				else if(line.contains(".org."))line = line.substring(0, line.length()-7);//.org.**
				else if(line.contains(".net."))line = line.substring(0, line.length()-7);//.net.**
				else if(line.contains(".gob."))line = line.substring(0, line.length()-7);//.gob.**
				else if(line.contains(".info."))line = line.substring(0, line.length()-8);//.info.**
				else if(line.contains(".blog."))line = line.substring(0, line.length()-8);//.blog.**
				else if(line.contains(".ne."))line = line.substring(0, line.length()-6);//.ne.**
				else if(line.contains(".edu."))line = line.substring(0, line.length()-7);//.edu.**
				else if(line.contains(".mil."))line = line.substring(0, line.length()-7);//.mil.**
				else if(line.contains(".nic."))line = line.substring(0, line.length()-7);//.nic.**
				else if(line.contains(".or."))line = line.substring(0, line.length()-6);//.or.**
				else if(line.contains(".web."))line = line.substring(0, line.length()-7);//.web.**
				else if(line.contains(".free."))line = line.substring(0, line.length()-8);//.free.**
				else if(line.contains(".gouv."))line = line.substring(0, line.length()-8);//.free.**
				else if(line.contains(".fed."))line = line.substring(0, line.length()-7);//.fed.**
				else if(line.contains(".in."))line = line.substring(0, line.length()-6);//.in.**
				else if(line.contains(".biz."))line = line.substring(0, line.length()-7);//.biz.**
				else if(line.contains(".jus."))line = line.substring(0, line.length()-7);//.jus.**
				else if(line.matches(".*[.]\\w\\w[.]us"))line = line.substring(0, line.length()-6);//.**.us
				else if(line.matches(".*[.]\\w\\w[.]ca"))line = line.substring(0, line.length()-6);//.**.ca
				else if(line.matches(".*[.]\\w\\w[.]jp"))line = line.substring(0, line.length()-6);//.**.jp
				else if(line.indexOf(".com")==line.length()-4&&line.length()-4!=-1)line=line.substring(0,line.length()-4);//.com
				else if(line.indexOf(".gov")==line.length()-4&&line.length()-4!=-1)line=line.substring(0,line.length()-4);//.gov
				else if(line.indexOf(".org")==line.length()-4&&line.length()-4!=-1)line=line.substring(0,line.length()-4);//.org
				else if(line.indexOf(".net")==line.length()-4&&line.length()-4!=-1)line=line.substring(0,line.length()-4);//.net
				else if(line.indexOf(".ru")==line.length()-3&&line.length()-3!=-1)line=line.substring(0,line.length()-3);//.ru
				else if(line.indexOf(".biz")==line.length()-4&&line.length()-4!=-1)line=line.substring(0,line.length()-4);//.biz
				else if(line.indexOf(".info")==line.length()-5&&line.length()-5!=-1)line=line.substring(0,line.length()-5);//.info
				else if(line.contains(".")) line=line.substring(0,line.lastIndexOf(".")-1);
				
				count++;
			}
			for(String s:list){
				out.write(s+"\n");
			}
			out.close();
		}catch(IOException e){
			System.out.println("unknown IOException");
			return;
		}
		System.out.println(count);
	}
	
	static void processLines1(BufferedReader in, FileWriter out){//for the alexa data, remove some google's
		try{
			String line = null;
			while((line=in.readLine())!=null){
				if(line.contains("google.")){
					System.out.println(line);
					continue;
				}
				out.write(line+"\n");
			}
		}catch(IOException e){
			System.out.println("unknown IOException");
			return;
		}
		
	}
	
	static void processLines0(BufferedReader in, FileWriter out){//for the bank data
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